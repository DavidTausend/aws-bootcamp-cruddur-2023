//OTEL HoneyComb
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';

const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const exporter = new OTLPTraceExporter({
 url: 'https://3000-davidtausen-awsbootcamp-jzanev7oe34.ws-eu88.gitpod.io:443/v1/traces'
});
const provider = new WebTracerProvider({
 resource: new Resource({
   [SemanticResourceAttributes.SERVICE_NAME]: 'browser',
 }),
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register({
 contextManager: new ZoneContextManager()
});
registerInstrumentations({
 instrumentations: [
   getWebAutoInstrumentations({
     // load custom configuration for xml-http-request instrumentation
     '@opentelemetry/instrumentation-xml-http-request': {
       propagateTraceHeaderCorsUrls: [
           /.+/g,
         ],
     },
     // load custom configuration for fetch instrumentation
     '@opentelemetry/instrumentation-fetch': {
       propagateTraceHeaderCorsUrls: [
           /.+/g,
         ],
     },
   }),
 ],
});