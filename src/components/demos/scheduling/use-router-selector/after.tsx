import logger from '@utils/logger';
import { useHistorySelector } from '@utils/router';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

import Badge from './badge';
import Links from './links';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function Pathname() {
  const pathname = useHistorySelector((history) => history.location.pathname);
  logger.header('useHistorySelector');
  logger.keyValue('Pathname', 'Re-Render');
  return <Badge title={pathname} subtitle="pathname" />;
}

function Hash() {
  const hash = useHistorySelector((history) => history.location.hash);
  logger.header('useHistorySelector');
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
        <CardTitle>[after] useHistorySelector</CardTitle>
      </CardHeader>
      <CardContent>
        <Pathname />
        <Hash />
        <Links />
      </CardContent>
    </Card>
  );
}
