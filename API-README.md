# ImageTools API Documentation

This document provides information on how to use the ImageTools API to process images programmatically.

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

To get an API key, visit the [API documentation page](/api) and click on "Get Your API Key".

## Rate Limits

API usage is subject to rate limits based on your subscription plan:

- Free tier: 100 requests/month
- Basic tier: 1,000 requests/month
- Pro tier: 10,000 requests/month
- Enterprise tier: Custom limits

Rate limit information is included in the response headers:
- `X-RateLimit-Limit`: Total number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining in the current period

## API Endpoints

### Compress Image

Reduce image file size while maintaining quality.

**Endpoint:** `POST /api/compress`

**Parameters:**
- `image` (file, required): The image file to compress
- `quality` (number, optional): Compression quality (1-100, default: 80)

**Example Request:**
\`\`\`bash
curl -X POST \
  https://imagetools.example.com/api/compress \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "quality=80"
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/compressed_image_123456.jpg",
  "metadata": {
    "original_size": 1024000,
    "compressed_size": 204800,
    "savings_percentage": 80,
    "quality": 80
  }
}
\`\`\`

### Resize Image

Change image dimensions.

**Endpoint:** `POST /api/resize`

**Parameters:**
- `image` (file, required): The image file to resize
- `width` (number, required): Target width in pixels
- `height` (number, required): Target height in pixels
- `maintain_aspect_ratio` (boolean, optional): Whether to maintain aspect ratio (default: true)

**Example Request:**
\`\`\`bash
curl -X POST \
  https://imagetools.example.com/api/resize \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "width=800" \
  -F "height=600" \
  -F "maintain_aspect_ratio=true"
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/resized_image_123456.jpg",
  "metadata": {
    "original_width": 1920,
    "original_height": 1080,
    "new_width": 800,
    "new_height": 600,
    "maintain_aspect_ratio": true
  }
}
\`\`\`

### Crop Image

Crop image to specific dimensions.

**Endpoint:** `POST /api/crop`

**Parameters:**
- `image` (file, required): The image file to crop
- `x` (number, required): X coordinate of top-left corner
- `y` (number, required): Y coordinate of top-left corner
- `width` (number, required): Width of crop area
- `height` (number, required): Height of crop area

**Example Request:**
\`\`\`bash
curl -X POST \
  https://imagetools.example.com/api/crop \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "x=100" \
  -F "y=100" \
  -F "width=500" \
  -F "height=500"
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/cropped_image_123456.jpg",
  "metadata": {
    "original_width": 1920,
    "original_height": 1080,
    "crop_x": 100,
    "crop_y": 100,
    "crop_width": 500,
    "crop_height": 500
  }
}
\`\`\`

### Convert Image Format

Convert image to different format.

**Endpoint:** `POST /api/convert`

**Parameters:**
- `image` (file, required): The image file to convert
- `format` (string, required): Target format (jpeg, png, webp)
- `quality` (number, optional): Output quality for lossy formats (1-100, default: 80)

**Example Request:**
\`\`\`bash
curl -X POST \
  https://imagetools.example.com/api/convert \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "format=webp" \
  -F "quality=90"
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/converted_image_123456.webp",
  "metadata": {
    "original_format": "jpeg",
    "original_size": 1024000,
    "converted_format": "webp",
    "converted_size": 204800,
    "quality": 90
  }
}
\`\`\`

### Remove Background

Remove image background.

**Endpoint:** `POST /api/remove-bg`

**Parameters:**
- `image` (file, required): The image file to process
- `return_format` (string, optional): Output format (png, webp, default: png)

**Example Request:**
\`\`\`bash
curl -X POST \
  https://imagetools.example.com/api/remove-bg \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg" \
  -F "return_format=png"
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/nobg_image_123456.png",
  "metadata": {
    "format": "png"
  }
}
\`\`\`

## Error Handling

In case of an error, the API will return a JSON response with an error message:

\`\`\`json
{
  "status": "error",
  "message": "Error message details"
}
\`\`\`

Common error status codes:
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `429`: Rate limit exceeded
- `500`: Server error

## Support

If you have any questions or need assistance, please contact our support team at support@imagetools.example.com.
