import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';

// Create a resource with the service name
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'frontend-react-js',
});

// Configure the OTLP trace exporter with the backend URL
const exporter = new OTLPTraceExporter({
  url: `${process.env.REACT_APP_BACKEND_URL}/honeycomb/traces`,
});

// Configure the web tracer provider with the exporter and resource
const provider = new WebTracerProvider({
  resource: resource,
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// Register the provider and context manager
provider.register({
  contextManager: new ZoneContextManager(),
});