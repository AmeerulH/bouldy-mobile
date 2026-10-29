import type { AttemptResult, Gym, Route } from '../data/types.ts';
import { journalComplete, routeProgress, type Journal } from '../domain/journal-summary.ts';

// Source: app/(app)/climbs/page.tsx. Grades compare within one gym only.
export function collectClimbs(journal: Journal, gyms: Gym[] | null, routes: Route[] | null) {
  const byGym = new Map((gyms ?? []).map(gym => [gym.id, gym]));
  const byRoute = new Map((routes ?? []).map(route => [route.id, route]));
  const logged = new Set(journal.records.flatMap(record => record.attempts.map(attempt => attempt.route_id)));
  const order: AttemptResult[] = ['flash', 'send', 'zone', 'project'];
  const items = [...logged].flatMap(id => {
    const route = byRoute.get(id); if (!route) return [];
    const previous = routeProgress(journal, id), results = new Set(previous.entries.map(({ attempt }) => attempt.result));
    const best = order.find(result => results.has(result)) ?? 'project';
    return [{ route, best, tries: previous.total, visits: new Set(previous.entries.map(({ session }) => session.id)).size,
      gym: { id: route.gym_id, name: byGym.get(route.gym_id)?.name ?? 'Unknown gym' },
      status: best === 'flash' ? 'flash' : best === 'send' ? 'sent' : 'project',
      state: { route, previous, ambiguous: previous.ambiguous, project: false } }];
  });
  return { items, sent: items.filter(item => ['sent', 'flash'].includes(item.status)).length,
    gyms: new Set(items.map(item => item.gym.id)).size,
    warning: !journalComplete(journal) || !routes || items.length < logged.size };
}
