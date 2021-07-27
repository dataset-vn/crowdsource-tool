import React from 'react';
import { SidebarMenu } from '../../components/SidebarMenu/SidebarMenu';
import { Members } from './Members/Members';
import { DangerZone } from './DangerZone';
import { GeneralSettings } from './GeneralSettings';
import { InstructionsSettings } from './InstructionsSettings';
import { LabelingSettings } from './LabelingSettings';
import { MachineLearningSettings } from './MachineLearningSettings/MachineLearningSettings';
import { StorageSettings } from './StorageSettings/StorageSettings';

export const MenuLayout = ({children, ...routeProps}) => {
  return (
    <SidebarMenu
      menuItems={[
        // GeneralSettings,
        // LabelingSettings,
        // InstructionsSettings,
        // MachineLearningSettings,
        // StorageSettings,
        // DangerZone,
        Members,
      ]}
      path={routeProps.match.url}
      children={children}
    />
  );
};

export const SettingsPage = {
  title: "Settings",
  path: "/settings",
  exact: true,
  layout: MenuLayout,
  component: GeneralSettings,
  pages: {
    // InstructionsSettings,
    // LabelingSettings,
    // MachineLearningSettings,
    // StorageSettings,
    // DangerZone,
    Members,
  },
};
