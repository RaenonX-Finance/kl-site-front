import React from 'react';

import {signOut, useSession} from 'next-auth/react';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';

import {errorDispatchers} from '../../../state/error/dispatchers';
import {ErrorDispatcherName} from '../../../state/error/types';
import {useDispatch} from '../../../state/store';
import styles from '../../nav/main.module.scss';


export const LogoutNavButton = () => {
  const [disabled, setDisabled] = React.useState(false);
  const {status} = useSession();
  const dispatch = useDispatch();

  const onClick = () => {
    setDisabled(true);
    signOut().catch((error) => {
      console.error(error);
      dispatch(errorDispatchers[ErrorDispatcherName.UPDATE]({message: JSON.stringify(error)}));
    });
  };

  if (status === 'unauthenticated') {
    return <></>;
  }

  return (
    <Nav.Link className={styles['nav-item']} disabled={status === 'loading'} onClick={onClick}>
      {disabled && <><Spinner size="sm" animation="border"/>&nbsp;</>}登出
    </Nav.Link>
  );
};
