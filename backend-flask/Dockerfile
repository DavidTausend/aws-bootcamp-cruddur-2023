FROM python:3.10-slim-buster

# Set environment variables
ENV FLASK_ENV=development
ENV PORT=4567

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/usr/local -r requirements.txt

# Copy application files
COPY . .

# Expose port and start Flask app
EXPOSE ${PORT}
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]