import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { LsSlack, LsFacebook } from '../../assets/icons';
import { Block, Elem } from '../../utils/bem';
import { copyText, absoluteURL } from '../../utils/helpers';
import { Button } from '../Button/Button';
import { Space } from '../Space/Space';
import "./Error.styl";

const SLACK_INVITE_URL = "https://join.slack.com/t/label-studio/shared_invite/zt-cr8b7ygm-6L45z7biEBw4HXa5A2b5pw";
const FACEBOOK_PAGE_URL = "https://facebook.com/dataset.vn"
export const ErrorWrapper = ({title, message, errorId, stacktrace, validation, version, onGoBack, onReload, possum}) => {
  const preparedStackTrace = useMemo(() => {
    return (stacktrace ?? "").trim();
  }, [stacktrace]);

  const [copied, setCopied] = useState(false);

  const copyStacktrace = useCallback(() => {
    setCopied(true);
    copyText(preparedStackTrace);
    setTimeout(() => setCopied(false), 1200);
  }, [preparedStackTrace]);

  return (
    <Block name="error-message">
      {possum !== false && (
        <Elem
          tag="img"
          name="DATASET_error_message"
          src={absoluteURL("/static/images/logodataset copy.svg")}
          height="111"
          alt="DATASET_D_letter"
        />
      )}

      {title && (
        <Elem name="title">{title}</Elem>
      )}

      {message && <Elem name="detail"dangerouslySetInnerHTML={{
        __html: String(message),
      }}/>}

      {preparedStackTrace && (
        <Elem name="stracktrace" dangerouslySetInnerHTML={{
          __html: preparedStackTrace.replace(/(\n)/g, '<br>'),
        }}/>
      )}


      {validation?.length && (
        <Elem tag="ul" name="validation">
          {validation.map(([field, errors]) => (
            <Fragment key={field}>
              {[].concat(errors).map((err, i) => (
                <Elem
                  tag="li"
                  key={i}
                  name="message"
                  dangerouslySetInnerHTML={{__html: err}}
                />
              ))}
            </Fragment>
          ))}
        </Elem>
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
          <Elem tag={Button} name="action-slack" target="_blank" icon={<LsFacebook/>} href={FACEBOOK_PAGE_URL}>
            Ask on Facebook
          </Elem>

          <Space size="small">
            {preparedStackTrace && <Button disabled={copied} onClick={copyStacktrace} style={{width: 180}}>
              {copied ? "Copied" : "Copy Stacktrace"}
            </Button>}
            {onGoBack && <Button onClick={onGoBack}>Go Back</Button>}
            {onReload && <Button onClick={onReload}>Reload</Button>}
          </Space>
        </Space>
      </Elem>

    </Block>
  );
};



