import React from 'react';

import {useSession} from 'next-auth/react';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import {PxInitMessage} from '../../../../hooks/socket/general/type';
import {PxSocketContext} from '../../../../hooks/socket/px/const';
import {PxDataUniqueIdentifier} from '../../../../types/pxData';
import {PeriodSelector} from './period';
import {ProductSelector} from './product';
import {TargetSelectorCommonProps} from './type';


type Props = TargetSelectorCommonProps & {
  show: boolean,
  setShow: (show: boolean) => void,
};

export const TargetSelectorModal = ({show, setShow, ...props}: Props) => {
  const {data} = useSession();
  const socket = React.useContext(PxSocketContext);
  const [disabled, setDisabled] = React.useState(false);

  const token = data?.user?.token;

  const beforeUpdate = () => {
    setDisabled(true);
  };

  const afterUpdate = (identifier: PxDataUniqueIdentifier) => {
    setShow(false);
    setDisabled(false);

    if (!socket) {
      throw Error(`Socket is [null], cannot request px data of [${identifier}]`);
    }

    const message: PxInitMessage = {
      token: data?.user?.token,
      identifiers: [identifier],
    };
    socket.emit('pxInit', message);
  };

  if (!token) {
    return <></>;
  }

  return (
    <Modal show={show} size="lg" onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>商品、週期選擇</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <ProductSelector
              disabled={disabled} token={token}
              beforeUpdate={beforeUpdate} afterUpdate={afterUpdate}
              {...props}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <PeriodSelector
              disabled={disabled} token={token}
              beforeUpdate={beforeUpdate} afterUpdate={afterUpdate}
              {...props}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
