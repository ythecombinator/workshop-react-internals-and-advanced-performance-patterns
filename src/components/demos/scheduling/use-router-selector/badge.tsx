import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface BadgeProps {
  title: string;
  subtitle: string;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Badge(props: BadgeProps) {
  const { title, subtitle } = props;

  return (
    <div>
      <div>
        <Typography.h3>{subtitle}</Typography.h3>
        <Typography.lead>{title}</Typography.lead>
      </div>
    </div>
  );
}
