import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { DtsFacebook } from '../../assets/icons';
import { Block, Elem } from '../../utils/bem';
import { absoluteURL, copyText } from '../../utils/helpers';
import { Button } from '../Button/Button';
import { Space } from '../Space/Space';
import "./Error.styl";
import { useTranslation } from "react-i18next";

const FACEBOOK_PAGE_URL = "https://facebook.com/dataset.vn"

export const ErrorWrapper = ({title, message, errorId, stacktrace, validation, version, onGoBack, onReload, possum = false}) => {
  const preparedStackTrace = useMemo(() => {
    return (stacktrace ?? "").trim();
  }, [stacktrace]);

  const [copied, setCopied] = useState(false);

  const copyStacktrace = useCallback(() => {
    setCopied(true);
    copyText(preparedStackTrace);
    setTimeout(() => setCopied(false), 1200);
  }, [preparedStackTrace]);

  const { t } = useTranslation();

  return (
    <Block name="error-message">
      {possum !== false && (
        <Elem
          tag="img"
          name="heidi"
          src={absoluteURL("/static/images/opossum_broken.svg")}
          height="111"
          alt="Heidi's down"
        />
      )}

      {title && (
        <Elem name="title">{title}</Elem>
      )}

      {(version || errorId) && (
        <Elem name="version">
          <Space>
            {version && `Version: ${version}`}
            {errorId && `Error ID: ${errorId}`}
          </Space>
        </Elem>
      )}

      <Elem name="actions">
        <Space spread>
          <Elem tag={Button} name="action-slack" target="_blank" icon={<DtsFacebook/>} href={FACEBOOK_PAGE_URL}>

            Ask on Facebook

          </Elem>

          <Space size="small">
            {preparedStackTrace && <Button disabled={copied} onClick={copyStacktrace} style={{width: 180}}>
              {copied ? "Copied" : "Copy Stacktrace"}
            </Button>}
            {onGoBack && <Button onClick={onGoBack}>{ t('ErrorWrapper.button1')  /*Go Back*/ } </Button>}
            {onReload && <Button onClick={onReload}>{ t('ErrorWrapper.button2') /*Reload*/ }</Button>}
          </Space>
        </Space>
      </Elem>

    </Block>
  );
};




