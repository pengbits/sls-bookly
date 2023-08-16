function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}

export const success = (body) => {
  return buildResponse(200, body);
}

export const failure = (body) => {
  return buildResponse(500, body);
}