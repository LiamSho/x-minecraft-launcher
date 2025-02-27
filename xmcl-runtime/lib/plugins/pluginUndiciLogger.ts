import { channel } from 'diagnostics_channel'
import { DiagnosticsChannel } from 'undici'
import { LauncherAppPlugin } from '../app/LauncherApp'

export const pluginUndiciLogger: LauncherAppPlugin = (app) => {
  const undici = app.logManager.openLogger('undici')

  channel('undici:request:create').subscribe((m, name) => {
    const msg: DiagnosticsChannel.RequestCreateMessage = m as any
    undici.log(`request:create ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers}`)
  })
  channel('undici:request:bodySent').subscribe((m, name) => {
    const msg: DiagnosticsChannel.RequestBodySentMessage = m as any
    undici.log(`request:bodySent ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers}`)
  })
  channel('undici:request:headers').subscribe((m, name) => {
    const msg: DiagnosticsChannel.RequestHeadersMessage = m as any
    undici.log(`request:headers ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers} ${msg.response.statusCode} ${msg.response.headers}`)
  })
  channel('undici:request:trailers').subscribe((m, name) => {
    const msg = m as DiagnosticsChannel.RequestTrailersMessage
    undici.log(`request:trailers ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers} ${msg.trailers}`)
  })
  channel('undici:request:error').subscribe((m, name) => {
    const msg = m as DiagnosticsChannel.RequestErrorMessage
    undici.error(`request:error ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers}: %O`, msg.error)
  })
  channel('undici:client:sendHeaders').subscribe((m, name) => {
    const msg: DiagnosticsChannel.ClientSendHeadersMessage = m as any
    undici.log(`client:sendHeaders ${msg.request.method} ${msg.request.origin}${msg.request.path} ${msg.request.headers} ${msg.socket.remoteAddress}`)
  })
  channel('undici:client:beforeConnect').subscribe((msg, name) => {
    const m = msg as DiagnosticsChannel.ClientBeforeConnectMessage
    undici.log(`client:beforeConnect ${m.connectParams.protocol}${m.connectParams.hostname}:${m.connectParams.port} ${m.connectParams.servername}`)
  })
  channel('undici:client:connectError').subscribe((msg, name) => {
    const m: DiagnosticsChannel.ClientConnectErrorMessage = msg as any
    undici.error(`client:connectError ${m.connectParams.protocol}${m.connectParams.hostname}:${m.connectParams.port} ${m.connectParams.servername} %O`, m.error)
  })
  channel('undici:client:connected').subscribe((msg, name) => {
    const m: DiagnosticsChannel.ClientConnectedMessage = msg as any
    undici.log(`client:connected ${m.connectParams.protocol}//${m.connectParams.hostname}:${m.connectParams.port} ${m.connectParams.servername} -> ${m.socket.remoteAddress}`)
  })
}
