import { ParentSize } from '@visx/responsive';

import BrushChart from '@components/elements/charts/brush-chart';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface DashboardData {
  date: string;
  value: string;
  label: string;
}

interface Props {
  onChange: any;
  initialData: DashboardData[];
  data: DashboardData[];
}

//  ---------------------------------------------------------------------------
//  UI
//  ---------------------------------------------------------------------------

function Dashboard(props: Props) {
  const { data, initialData, onChange } = props;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ParentSize>
            {({ width }) => (
              <BrushChart
                width={width}
                height={350}
                initialData={initialData}
                onChange={onChange}
              />
            )}
          </ParentSize>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {data.map((item) => (
              <li key={item.label}>
                {item.label}: {item.value} visitors
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
