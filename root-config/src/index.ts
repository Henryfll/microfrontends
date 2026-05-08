import { registerApplication, start, navigateToUrl } from 'single-spa';
import { loadAngularMF, loadSystemMF } from './loaders';

const matchPath = (prefix: string) => (location: Location): boolean =>
  location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);

registerApplication({
  name: '@mf/mf-a',
  app: () => loadAngularMF(),
  activeWhen: matchPath('/mfa'),
});

registerApplication({
  name: '@mf/mf-b',
  app: () => loadSystemMF('@mf/mf-b'),
  activeWhen: matchPath('/mfb'),
});

registerApplication({
  name: '@mf/mf-c',
  app: () => loadSystemMF('@mf/mf-c'),
  activeWhen: matchPath('/mfc'),
});

document
  .querySelectorAll<HTMLButtonElement>('#nav button[data-route]')
  .forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      if (route) navigateToUrl(route);
    });
  });

if (location.pathname === '/' || location.pathname === '') {
  history.replaceState(null, '', '/mfa');
}

start({ urlRerouteOnly: true });
