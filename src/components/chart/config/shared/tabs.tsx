import React from 'react';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import {defaultSharedConfig} from '../../../../state/config/const';
import {getSharedConfig} from '../../../../state/config/utils';
import {FloatingInput} from '../../../common/form/floating/input';
import {TextWithLoading} from '../../../common/loading/text';
import {ChartLayoutSelector} from '../../layoutSelector/main';
import {groupedSharedConfigEntries} from '../const';
import styles from './main.module.scss';
import {PxSharedConfig, PxSharedConfigKeys} from './type';


type Props = {
  configLocal: PxSharedConfig,
  setConfigLocal: (updated: PxSharedConfig) => void,
  closeModal: () => void,
  updating: boolean,
};

export const PxChartSharedConfigTabs = ({configLocal, setConfigLocal, closeModal, updating}: Props) => {
  return (
    <Tab.Container defaultActiveKey="layout">
      <Row className="g-3 p-3">
        <Col sm={3}>
          <Nav variant="pills" className="flex-column" navbar={false}>
            <Nav.Item>
              <Nav.Link eventKey="layout" className={styles['tab-group']}>版面配置</Nav.Link>
            </Nav.Item>
            {Object.keys(groupedSharedConfigEntries).map((group) => (
              <Nav.Item key={group}>
                <Nav.Link eventKey={group} className={styles['tab-group']}>{group}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="layout">
              <ChartLayoutSelector onSelect={closeModal}/>
            </Tab.Pane>
            {Object.entries(groupedSharedConfigEntries).map(([group, entries]) => (
              <Tab.Pane key={group} eventKey={group}>
                {Object.entries(entries).map(([key, entry]) => {
                  const configKey = key as PxSharedConfigKeys;
                  const {title, isDisabled, tips, min, step} = entry;

                  const value = getSharedConfig(configLocal, configKey);
                  const disabled = updating || (isDisabled && isDisabled(configLocal));

                  return (
                    <FloatingInput
                      key={key}
                      type="number"
                      label={title}
                      value={value}
                      onChange={({target}) => setConfigLocal({
                        ...configLocal,
                        [configKey]: (target.value === '' || target.value === '0') ?
                          (min || defaultSharedConfig[configKey]) :
                          parseFloat(target.value),
                      })}
                      className="w-100 mb-3"
                      disabled={disabled}
                      min={min}
                      step={step}
                      description={tips}
                    />
                  );
                })}
                <Row className="text-end">
                  <Col>
                    {updating && <TextWithLoading show={updating} text="更新中"/>}
                  </Col>
                </Row>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};
