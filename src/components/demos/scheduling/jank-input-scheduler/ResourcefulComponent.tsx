import { FAST_resourcefulOperation, Scheduler } from '@utils/scheduling';

import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//   TYPES
//  ---------------------------------------------------------------------------

interface Props {
  value: number;
}

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const initialValue = 0 as number;
const scheduler = new Scheduler(FAST_resourcefulOperation, initialValue);

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function ResourcefulComponent(props: Props) {
  const { value } = props;
  const result = scheduler.performUnitOfWork(value);

  return <Typography.subtle>Large number: {result}</Typography.subtle>;
}
