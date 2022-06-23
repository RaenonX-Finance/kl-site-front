import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';

import {LayoutIcon1of1x1} from './icon/1-1x1';
import {LayoutIcon2of1x2} from './icon/2-1x2';
import {LayoutIcon2of2x1} from './icon/2-2x1';
import {LayoutIcon3of1x3} from './icon/3-1x3';
import {LayoutIcon3of3x1} from './icon/3-3x1';
import {LayoutIcon3ofBF} from './icon/3-BF';
import {LayoutIcon3ofLF} from './icon/3-LF';
import {LayoutIcon3ofRF} from './icon/3-RF';
import {LayoutIcon3ofTF} from './icon/3-TF';
import {LayoutIcon4of1x4} from './icon/4-1x4';
import {LayoutIcon4of2x2} from './icon/4-2x2';
import {LayoutIcon4of4x1} from './icon/4-4x1';
import {LayoutIcon4ofB2} from './icon/4-B2';
import {LayoutIcon4ofBF} from './icon/4-BF';
import {LayoutIcon4ofL2} from './icon/4-L2';
import {LayoutIcon4ofLF} from './icon/4-LF';
import {LayoutIcon4ofR2} from './icon/4-R2';
import {LayoutIcon4ofRF} from './icon/4-RF';
import {LayoutIcon4ofT2} from './icon/4-T2';
import {LayoutIcon4ofTF} from './icon/4-TF';
import {ChartLayoutOptions} from './optionRow';


export const ChartLayoutSelector = () => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Nav.Link onClick={() => setShow(true)}>
        版面配置
      </Nav.Link>
      <Modal show={show} size="lg" onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>選擇版面</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChartLayoutOptions
            count={1}
            icons={[
              () => <LayoutIcon1of1x1/>,
            ]}
          />
          <ChartLayoutOptions
            count={2}
            icons={[
              () => <LayoutIcon2of2x1/>,
              () => <LayoutIcon2of1x2/>,
            ]}
          />
          <ChartLayoutOptions
            count={3}
            icons={[
              () => <LayoutIcon3of3x1/>,
              () => <LayoutIcon3of1x3/>,
              () => <LayoutIcon3ofLF/>,
              () => <LayoutIcon3ofRF/>,
              () => <LayoutIcon3ofTF/>,
              () => <LayoutIcon3ofBF/>,
            ]}
          />
          <ChartLayoutOptions
            count={4}
            icons={[
              () => <LayoutIcon4of2x2/>,
              () => <LayoutIcon4of4x1/>,
              () => <LayoutIcon4of1x4/>,
              () => <LayoutIcon4ofLF/>,
              () => <LayoutIcon4ofRF/>,
              () => <LayoutIcon4ofTF/>,
              () => <LayoutIcon4ofBF/>,
              () => <LayoutIcon4ofL2/>,
              () => <LayoutIcon4ofR2/>,
              () => <LayoutIcon4ofT2/>,
              () => <LayoutIcon4ofB2/>,
            ]}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};