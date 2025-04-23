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
  resourcefulOperation(value);

  return <Typography.subtle>Large number: {props.value}</Typography.subtle>;
}
