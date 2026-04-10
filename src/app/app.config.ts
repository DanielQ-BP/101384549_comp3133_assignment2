import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(ApolloModule),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const authLink = setContext((_, { headers }) => {
          const token = localStorage.getItem('auth_token');
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            },
          };
        });

        const http = httpLink.create({
          uri: 'https://comp3133assignment1-production.up.railway.app/graphql',
        });

        return {
          link: ApolloLink.from([authLink as any, http]),
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: { fetchPolicy: 'network-only' },
            query: { fetchPolicy: 'network-only' },
          },
        };
      },
      deps: [HttpLink],
    },
  ],
};
