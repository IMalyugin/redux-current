import React from 'react';

export const MockText: React.FC<{ testId?: string }> = ({ testId, children }) => {
  return <div data-testid={testId}>{children}</div>;
};
