// server/api/upload.ts
import { defineEventHandler, readMultipartFormData } from 'h3'
import { randomBytes } from 'node:crypto'
import { writeFile, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { exec as _exec } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(_exec)
const FLAG = process.env.CTF_FLAG ?? 'flag{this_is_a_fake_flag}'


const executeWithTimeout = async (cmd: string, timeout: number) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    return (await exec(cmd, {
      signal: controller.signal,
    })).stdout.trim()
  } catch (err: any) {
    if (err.signal === 'SIGABRT') {
      throw new Error('执行超时')
    }
    return ''
  } finally {
    clearTimeout(timeoutId)
  }
}

const dockerExecute = async (filePath: string, runtime: string) =>{
  const containerName = `ctf_${randomBytes(4).toString('hex')}`
  const cmd = [
    'docker run -i --rm',
    `-v ${filePath}:/tmp/code:ro`,
    `nikolaik/python-nodejs:python3.13-nodejs22-alpine`,
    `${runtime} /tmp/code`
  ].join(' ')

  try {
    return await executeWithTimeout(cmd, 1000)
  } catch (err) {
    return ''
  }
}

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  const uploadedFile = files?.find(f => f.name === 'file')

  if (!uploadedFile) {
    throw createError({ statusCode: 400, message: '请上传文件' })
  }

  const tempName = `polyglot_${randomBytes(8).toString('hex')}`
  const tempPath = join(tmpdir(), tempName)

  try {
    await writeFile(tempPath, uploadedFile.data)

    const [nodeResult, pythonResult] = await Promise.all([
      executeWithTimeout(`node ${tempPath}`, 2000),
      executeWithTimeout(`python ${tempPath}`, 2000)
    ])

    if (
      nodeResult.trim() == 'Hello JavaScript' &&
      pythonResult.trim() == 'Hello Python'
    ) {
      return FLAG
    }
    if (nodeResult.trim() == 'Hello JavaScript') {
      return '验证失败，你不会 Python！'
    }
    if (pythonResult.trim() == 'Hello Python') {
      return '验证失败，你不会 JavaScript！'
    }
    return '验证失败，你既不会 JavaScript 也不会 Python！'
  } catch (err) {
    return createError({
      statusCode: 500,
      message: `执行错误: ${(err as any).message}`
    })
  } finally {
    try { await unlink(tempPath) } catch (_) { }
  }
})

