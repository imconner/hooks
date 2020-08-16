import { LambdaParam } from '@midwayjs/hooks-shared'
import art from 'art-template'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { transform, SpecStructure } from '@midwayjs/serverless-spec-builder'

art.defaults.htmlMinifierOptions = {
  collapseWhitespace: false,
  minifyCSS: false,
  minifyJS: false,
  ignoreCustomFragments: [],
}

export interface RenderParam extends Partial<LambdaParam> {
  isExportDefault?: boolean
  functionId?: string
}

export function buildRequest(funcs: RenderParam[], cwd: string) {
  const { gateway, functionGroup } = getFunctionConfig(cwd)

  const template = readFileSync(resolve(__dirname, `../templates/request.art`), { encoding: 'utf-8' })

  const params = {
    gateway,
    functionGroup,
    funcs,
  }

  return art.render(template, params)
}

interface SpecStructureWithGateway extends SpecStructure {
  apiGateway?: {
    type?: string
  }
}

function getFunctionConfig(cwd: string) {
  const spec: SpecStructureWithGateway = transform(resolve(cwd, 'f.yml'))

  return {
    gateway: spec?.apiGateway?.type ?? 'http',
    functionGroup: spec.service.name,
  }
}