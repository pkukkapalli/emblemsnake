import { installRouter } from 'pwa-helpers/router';
import { ViewType, routeToViewType } from '../constants/routes';

export class RouterStore {
  private listener: (state: ViewType) => void;

  constructor(listener: (state: ViewType) => void) {
    this.listener = listener;
  }

  connect(): void {
    this.listener(ViewType.MAIN_MENU);
    installRouter(location => {
      const url = new URL(location.href);
      if (routeToViewType.has(url.pathname)) {
        const viewType = routeToViewType.get(url.pathname);
        if (!viewType) {
          throw new Error(
            `illegal state: null or undefined ViewType found for ${url.pathname}`
          );
        }
        this.listener(viewType);
      } else {
        // TODO: emit a NOT_FOUND view type instead.
        this.listener(ViewType.MAIN_MENU);
      }
    });
  }
}
