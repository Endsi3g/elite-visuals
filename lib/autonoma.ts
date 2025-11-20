import fetch from 'node-fetch';

const CLIENT_ID = process.env.AUTONOMA_CLIENT_ID || 'your-client-id';
const CLIENT_SECRET = process.env.AUTONOMA_CLIENT_SECRET || 'your-client-secret';

interface TestRunOptions {
  environment_application_version_id?: string;
  runtime_metadata?: Record<string, any>;
  source?: string;
}

interface TestRunResponse {
  id: string;
  status: string;
  test_id: string;
  created_at: string;
  [key: string]: any;
}

/**
 * Déclenche une exécution de test sur Autonoma
 * @param testId - ID du test à exécuter
 * @param options - Options supplémentaires pour l'exécution
 * @returns Réponse de l'API Autonoma
 */
export async function triggerTestRun(
  testId: string,
  options: TestRunOptions = {}
): Promise<TestRunResponse> {
  const response = await fetch(`https://autonoma.app/api/test/${testId}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'autonoma-client-id': CLIENT_ID,
      'autonoma-client-secret': CLIENT_SECRET,
    },
    body: JSON.stringify({
      environment_application_version_id: options.environment_application_version_id,
      runtime_metadata: options.runtime_metadata || {},
      source: options.source || 'api',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Autonoma API error: ${response.status} - ${errorText}`);
  }

  return await response.json() as TestRunResponse;
}

/**
 * Récupère le statut d'une exécution de test
 * @param runId - ID de l'exécution
 * @returns Statut de l'exécution
 */
export async function getTestRunStatus(runId: string): Promise<TestRunResponse> {
  const response = await fetch(`https://autonoma.app/api/test/run/${runId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'autonoma-client-id': CLIENT_ID,
      'autonoma-client-secret': CLIENT_SECRET,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Autonoma API error: ${response.status} - ${errorText}`);
  }

  return await response.json() as TestRunResponse;
}
