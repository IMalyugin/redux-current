import React from 'react';

export const MockContainer: React.FC<{ onClick?: (event: any) => void; testId?: string }> = ({
  onClick,
  testId,
  children,
}) => {
  return (
    <div data-testid={testId} onClick={onClick}>
      Hello, {children}, I`m Mock
    </div>
  );
};
