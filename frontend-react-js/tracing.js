//OTEL HoneyComb
import { BasicTracerProvider } from '@opentelemetry/tracing';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SpanStatusCode } from '@opentelemetry/api';

//OTEL_SERVICE_NAME: "frontend-react-js"
//OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
//OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
/* const OTEL_SERVICE_NAME = "<frontend-react-js>";
const OTEL_EXPORTER_OTLP_ENDPOINT = '<https://api.honeycomb.io>';
const OTEL_EXPORTER_OTLP_HEADERS = '<x-honeycomb-team=${HONEYCOMB_API_KEY}>'; */

const honeycombExporter = new CollectorTraceExporter({
  url: `https://api.honeycomb.io:443`,
  headers: {
    'x-honeycomb-team': OTEL_EXPORTER_OTLP_ENDPOINT,
    'x-honeycomb-dataset': OTEL_EXPORTER_OTLP_HEADERS,
  },
});

const tracerProvider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: OTEL_SERVICE_NAME,
  }),
});
tracerProvider.addSpanProcessor(new BatchSpanProcessor(honeycombExporter));

// tracer to instrument your application code
const tracer = tracerProvider.getTracer('my-tracer-name');
const span = tracer.startSpan('my-span-name');
span.setStatus({ code: SpanStatusCode.OK });
span.end();
