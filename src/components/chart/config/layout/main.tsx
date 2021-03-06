import React from 'react';

import {useSession} from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import {LayoutConfigUpdatePayload} from '../../../../state/config/type';
import {PxSlotName} from '../../../../types/pxData';
import {PxChartLayoutConfigEntries} from './entries';
import styles from './main.module.scss';
import {PxLayoutConfigSingle} from './type';
import {PxChartLayoutConfigUpdating} from './updating';


export type LayoutConfigPanelProps = {
  security: string,
  title: string,
  slot: PxSlotName,
  config: PxLayoutConfigSingle,
  setConfig: (payload: LayoutConfigUpdatePayload) => Promise<void>,
};

export const PxLayoutConfigPanel = ({
  security,
  title,
  slot,
  config,
  setConfig,
}: LayoutConfigPanelProps) => {
  const {data: session} = useSession();
  const [show, setShow] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  return (
    <>
      <Button size="sm" variant="outline-info" className="me-2" onClick={() => setShow(true)}>
        版面設定
      </Button>
      <Offcanvas className={styles['config-panel']} show={show} onHide={() => setShow(false)} placement="end">
        <div className="mb-0"/>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {`版面設定 (${title})`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr className="my-0"/>
        <Offcanvas.Body>
          {updating && <PxChartLayoutConfigUpdating/>}
          <PxChartLayoutConfigEntries
            security={security}
            config={config}
            updating={updating}
            updateConfig={(configKey, value) => {
              setUpdating(true);
              setConfig({
                token: session?.user?.token,
                slot,
                configKey,
                value,
              }).finally(() => setUpdating(false));
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
