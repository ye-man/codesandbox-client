import React from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { Container, Title, Text, Buttons } from './elements';

interface IAlertProps {
  title: string;
  body: string;
  confirmMessage?: string;
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Alert = ({
  title,
  body,
  confirmMessage = 'Confirm',
  onCancel,
  onConfirm,
  ...props
}: IAlertProps) => (
  <Container {...props}>
    <Title>{title}</Title>
    <Text>{body}</Text>
    <Buttons>
      <Button small block secondary onClick={onCancel}>
        Cancel
      </Button>
      <Button small block danger onClick={onConfirm}>
        {confirmMessage}
      </Button>
    </Buttons>
  </Container>
);

export default Alert;