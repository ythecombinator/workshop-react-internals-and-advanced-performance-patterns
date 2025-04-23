import { useLocation } from 'react-router-dom';

import logger from '@utils/logger';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

import Badge from './badge';
import Links from './links';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function Pathname() {
  const { pathname } = useLocation();
  logger.header('useLocation');
  logger.keyValue('Pathname', 'Re-Render');
  return <Badge title={pathname} subtitle="pathname" />;
}

function Hash() {
  const { hash } = useLocation();
  logger.header('useLocation');
  logger.keyValue('Hash', 'Re-Render');
  return <Badge title={hash} subtitle="hash" />;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>[before] useHistorySelector</CardTitle>
      </CardHeader>
      <CardContent>
        <Pathname />
        <Hash />
        <Links />
      </CardContent>
    </Card>
  );
}
