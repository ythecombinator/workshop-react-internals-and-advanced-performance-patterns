import { resourcefulOperation } from '@utils/scheduling';

import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//   TYPES
//  ---------------------------------------------------------------------------

interface Props {
  value: number;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function ResourcefulComponent(props: Props) {
  const { value } = props;
  const result = resourcefulOperation(value);

  return <Typography.subtle>Large number: {result}</Typography.subtle>;
}
