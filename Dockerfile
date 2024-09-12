FROM python:3.10.4-slim 

WORKDIR /app

# Copy the source code into the container.
COPY . .

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
# RUN --mount=type=cache,target=/root/.cache/pip \
#     --mount=type=bind,source=requirements.txt,target=requirements.txt \
#     python -m pip install -r requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r ./requirements.txt


# Expose the port that the application listens on.
# EXPOSE 3000

# Run the application.
CMD ["python3", "app.py"]
