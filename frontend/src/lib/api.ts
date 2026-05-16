const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function predictPrice(features: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Prediction failed';
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }
      throw new Error(errorMessage);
    }

    // Handle PHP specific response mapping
    const data = await response.json();
    return {
      ...data,
      predicted_price: data.predicted_price_php // Alias for existing components
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getAIAdvice(features: any, prediction: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/advisor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        features: features,
        prediction: prediction
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get AI advice');
    }

    return await response.json();
  } catch (error) {
    console.error('Advisor API Error:', error);
    throw error;
  }
}

export async function getInvestmentMetrics(price: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/investment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        predicted_price_php: price
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investment metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Investment API Error:', error);
    throw error;
  }
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'offline' };
  }
}
