import Command from '.';

test("Command.execute()", () => {
  let command = new Command((instance: any): any => {return instance});

  expect(command.execute('command_test')).toBe('command_test');
})