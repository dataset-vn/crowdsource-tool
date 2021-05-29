import React from 'react';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { StaticContent } from '../../app/StaticContent/StaticContent';
import { IconBook, IconBuilding, IconFolder, IconPersonInCircle, IconPin, IconTerminal, LsDoor, LsGitHub, LsSettings, LsSlack, LsFacebook, IconDataset, IconD } from '../../assets/icons';
import { ApiContext } from '../../providers/ApiProvider';
import { useConfig } from '../../providers/ConfigProvider';
import { useContextComponent } from '../../providers/RoutesProvider';
import { Block, cn, Elem } from '../../utils/bem';
import { absoluteURL } from '../../utils/helpers';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Dropdown } from "../Dropdown/Dropdown";
import { Hamburger } from "../Hamburger/Hamburger";
import { Menu } from '../Menu/Menu';
import { Userpic } from '../Userpic/Userpic';
import { VersionNotifier, VersionProvider } from '../VersionNotifier/VersionNotifier';
import './Menubar.styl';
import './MenuContent.styl';
import './MenuSidebar.styl';
import './Item.styl';



export const MenubarContext = createContext();

const LeftContextMenu = ({ className }) => (
  <StaticContent
    id="context-menu-left"
    className={className}
  >
    {(template) => <Breadcrumbs fromTemplate={template} />}</StaticContent>
);

const RightContextMenu = ({ className, ...props }) => {
  const { ContextComponent, contextProps } = useContextComponent();

  return ContextComponent ? (
    <div className={className}>
      <ContextComponent {...props} {...(contextProps ?? {})} />
    </div>
  ) : (
    <StaticContent
      id="context-menu-right"
      className={className}
    />
  );
};

export const Menubar = ({
  enabled,
  defaultOpened,
  defaultPinned,
  children,
  onSidebarToggle,
  onSidebarPin,
}) => {
  const menuDropdownRef = useRef();
  const useMenuRef = useRef();
  const location = useLocation();

  const api = React.useContext(ApiContext);

  const config = useConfig();
  const [sidebarOpened, setSidebarOpened] = useState(defaultOpened ?? false);
  const [sidebarPinned, setSidebarPinned] = useState(defaultPinned ?? false);
  const [organizations, setOrganizations] = useState([]);
  const [PageContext, setPageContext] = useState({
    Component: null,
    props: {},
  });

  const [inputValues, setInputValues] = useState("");
  const [descript, setDescript] = useState("");

  const [userID, setUserID] = useState(null)

  const [isChose, setIsChose] = useState(false);
  const [isCreate, setIsCreate] = useState(false);



  const menubarClass = cn('menu-header');
  const menubarContext = menubarClass.elem('context');
  const Itemcss = cn("itemstyle")
  const ItemBlockcss = cn("blockitemstyle")
  const sidebarClass = cn('sidebar');
  const inputCss = cn('inputCss');
  const flexRowCss = cn('flexRowCss');




  const contentClass = cn('content-wrapper');
  const menuItemcss = cn('menuItemcss');



  const contextItem = menubarClass.elem('context-item');

  const sidebarPin = useCallback((e) => {
    e.preventDefault();

    const newState = !sidebarPinned;
    setSidebarPinned(newState);
    onSidebarPin?.(newState);
  }, [sidebarPinned]);

  const sidebarToggle = useCallback((visible) => {
    const newState = visible;
    setSidebarOpened(newState);
    onSidebarToggle?.(newState);
  }, [sidebarOpened]);

  const providerValue = useMemo(() => ({
    PageContext,

    setContext(ctx) {
      setTimeout(() => {
        setPageContext({
          ...PageContext,
          Component: ctx,
        });
      });
    },

    setProps(props) {
      setTimeout(() => {
        setPageContext({
          ...PageContext,
          props,
        });
      });
    },

    contextIsSet(ctx) {
      return PageContext.Component === ctx;
    },
  }), [PageContext]);

  const changeOrganization = async (id) => {
    const response = await api.callApi("patchActiveOrganization", {
      body: {
        active_organization: id

      }
    })
    window.location.reload();
  }
  var swapOrganizations = (arr, id) => {
    let newarr = arr.filter(i => i["created_by"] !== id)
    let k = arr.filter(i => i["created_by"] === id)
    let res = k.concat(newarr)

return res
    }
  useEffect(async () => {
    if (!sidebarPinned) {
      menuDropdownRef?.current?.close();
    }
    useMenuRef?.current?.close();
    const response = await api.callApi("organizations")
    const responseGetActive = await api.callApi("getActiveOrganization");
  //  debugger
  



    setOrganizations(swapOrganizations(response, responseGetActive?.id))
    setUserID(responseGetActive?.id)


  }, [location]);

  const createOrg = async () => {
    if (inputValues !== "") {
      const response = await api.callApi("postOrganizations", {
        body: {
          title: inputValues
        }
      })

      if (response.status !== 500) {
        const resActiveOrg = await api.callApi("patchActiveOrganization", {
          body: {
            active_organization: response?.id

          }
        })

        window.location.reload();
      } else {
        setDescript("Tài khoản chỉ có thể tạo tối đa 01 tổ chức")
      }

    }

  }
  const deleteDectipt = () => {
    setIsCreate(!isCreate)
    setDescript("")
  }
  const wrapOtherComponents = () => {
    setIsChose(false)
    setDescript("")
  }
  return (
    <div className={contentClass}>
      {enabled && (
        <div className={menubarClass}>
          <Dropdown.Trigger
            dropdown={menuDropdownRef}
            closeOnClickOutside={!sidebarPinned}
          >
            <div className={`${menubarClass.elem('trigger')} main-menu-trigger`}>
              <img src={absoluteURL("/static/icons/dts_jsc_logo.svg")} alt="Dataset Logo" height="28" />
              <div onClick={wrapOtherComponents}>
                <Hamburger opened={sidebarOpened} />

              </div>
            </div>
          </Dropdown.Trigger>

          <div className={menubarContext}>
            <LeftContextMenu className={contextItem.mod({ left: true })} />

            <RightContextMenu className={contextItem.mod({ right: true })} />
          </div>

          <Dropdown.Trigger ref={useMenuRef} align="right" content={(
            <Menu>
              <Menu.Item
                icon={<LsSettings />}
                label="Account & Settings"
                href={absoluteURL("/user/account")}
                data-external
              />
              {/* <Menu.Item label="Dark Mode"/> */}
              <Menu.Item
                icon={<LsDoor />}
                label="Log Out"
                href={absoluteURL("/logout")}
                data-external
              />
            </Menu>
          )}>
            <div className={menubarClass.elem('user')}>
              <Userpic user={config.user} />
            </div>
          </Dropdown.Trigger>
        </div>
      )}


      <VersionProvider>
        <div className={contentClass.elem('body')}>
          {enabled && (
            <Dropdown
              ref={menuDropdownRef}
              onToggle={sidebarToggle}
              onVisibilityChanged={() => window.dispatchEvent(new Event('resize'))}
              visible={sidebarOpened}
              className={[sidebarClass, sidebarClass.mod({ floating: !sidebarPinned })].join(" ")}
              style={{ width: 240 }}
            >
              <Menu>
                <Menu.Item
                  label="Dự án"
                  to="/projects"
                  icon={<IconFolder />}
                  onClick={wrapOtherComponents}
                  data-external
                  exact
                />
                <Menu.Item
                  label="Thành viên"
                  to="/people"
                  icon={<IconPersonInCircle />}
                  onClick={wrapOtherComponents}
                  data-external
                  exact
                />

                <Menu.Item
                  label="Tổ chức"
                  // to="/organizations"
                  onClick={() => setIsChose(!isChose)}
                  icon={<IconBook />}
                  data-external
                  exact
                />

                {
                  isChose ?
                    (
                      <Block >
                        <Elem className={Itemcss} >

                        </Elem>

                        {organizations.map((i) => (
                          <Block>
                            <Menu.Item
                              label={userID === i.created_by ? `${i.title} (Admin)` : i.title}
                              style={{color:userID === i.created_by ? "#222f3e" : null}}
                              // to="/organizations"
                              // style={{ borderBottomColor: 'tomato',
                              className={menuItemcss}
                              onClick={() => changeOrganization(i.id)}
                            // icon={<IconBook />}
                            // data-external
                            // exact
                            />
                            <Elem className={Itemcss} >

                            </Elem>
                          </Block>

                        ))}

                        {
                          isCreate ? <Block>

                            <Block className={inputCss}>
                              <Elem style={{ color: "tomato" }}>{descript}</Elem>
                              < input type="text" style={{ width: "100%" }} placeholder="Tên tổ chức" onChange={e => setInputValues(e.target.value)} />
                            </Block>
                            <Block className={flexRowCss}>
                              <Menu.Item
                                label="Hủy"
                                onClick={() => deleteDectipt()}
                              />
                              <Menu.Item
                                label="Tạo"
                                onClick={createOrg}
                              />
                            </Block>
                          </Block> : <Menu.Item
                            label="Tạo tổ chức mới"
                            // className={menuItemcss} 
                            icon="+"
                            onClick={() => setIsCreate(!isCreate)}
                          />
                        }



                      </Block>


                    ) : null
                }


                <Menu.Spacer />

                <VersionNotifier showNewVersion />

                <Menu.Item
                  label="Facebook"
                  href="https://www.facebook.com/dataset.vn"
                  icon={<LsFacebook />}
                  target="_blank"
                />
                <Menu.Item
                  label="Dataset"
                  href="https://dataset.vn/"
                  icon={<IconD />}
                  target="_blank"
                />



                <Menu.Divider />

                <Menu.Item
                  icon={<IconPin />}
                  className={sidebarClass.elem('pin')}
                  onClick={sidebarPin}
                  active={sidebarPinned}
                >
                  {sidebarPinned ? "Unpin menu" : "Pin menu"}
                </Menu.Item>

              </Menu>
            </Dropdown>
          )}

          <MenubarContext.Provider value={providerValue}>
            <div className={contentClass.elem('content').mod({ withSidebar: sidebarPinned && sidebarOpened })}>
              {children}
            </div>
          </MenubarContext.Provider>
        </div>
      </VersionProvider>
    </div>
  );
};
