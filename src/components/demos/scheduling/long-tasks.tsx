import { blockMainThreadUntil } from '@utils/scheduling';

import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { Input } from '@components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@components/ui/table';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

const examples = [
  {
    label: `<input type="checkbox">`,
    example: (
      <div className="items-top flex space-x-2">
        <Checkbox id="terms1" />
        <label htmlFor="terms1">Check me</label>
      </div>
    ),
  },
  {
    label: `<input type="email">`,
    example: <Input type="email" placeholder="Email" />,
  },
  {
    label: '<a>',
    example: (
      <a href="#" className="hover:underline">
        Click me
      </a>
    ),
  },
];

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

function Demo() {
  const blockMainThread = () => {
    blockMainThreadUntil(10000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button onClick={blockMainThread}>Block the main thread</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Element</TableCell>
            <TableCell>Example</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {examples.map((example) => (
            <TableRow key={example.label}>
              <TableCell>
                <code>{example.label}</code>
              </TableCell>
              <TableCell>{example.example}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Demo;
