FROM python:3.9-slim
WORKDIR /app
RUN pip install fastapi uvicorn
COPY . .
# 0.0.0.0 önemli, Docker dışından erişim sağlar
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]