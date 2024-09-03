import { ReactEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select'
import S from './CampaignSelect.module.scss';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCampaigns, selectCoreEncounterSet } from '@/store/features/campaigns/campaigns';

import { refreshDividers, selectCampaign, selectIncludeCoreSet, setCampaign, setIncludeCoreSet, showAllSets } from '@/store/features/dividers/dividers';
import { Checkbox, InlineRow } from '@/components';
import { PropsWithClassName } from '@/types/util';
import classNames from 'classnames';
import { hasSets, isCoreCampaign } from '@/util/campaigns';

export type CampaignSelectProps = PropsWithClassName & {

}

export const CampaignSelect = ({ className }: CampaignSelectProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(selectCampaigns);
  const includeCoreSet = useAppSelector(selectIncludeCoreSet);
  const currentCampaign = useAppSelector(selectCampaign);
  const coreSet = useAppSelector(selectCoreEncounterSet);

  const isCore = currentCampaign && isCoreCampaign(currentCampaign);

  const showCheckbox = isCore || (currentCampaign && hasSets(currentCampaign, coreSet));

  const toggleCoreSet: ReactEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    const { checked } = target;
    dispatch(setIncludeCoreSet(checked));
    dispatch(refreshDividers());
  }

  const options = campaigns.map(({ campaign }) => ({
    label: campaign.name,
    value: campaign.id
  }))
  .sort((a, b) => a.label > b.label ? 1 : -1)

  const labels = campaigns.reduce((target, { campaign }) => {
    target[campaign.id] = campaign.name;
    return target
  }, {} as { [index: string]: string});
  
  const updateCampaign = (id: string | null) => {
    const campaign = campaigns.find(({ campaign }) => campaign.id === id);

    dispatch(showAllSets());
    dispatch(setCampaign(campaign || null));
    dispatch(refreshDividers());
  }

  return (
    <div className={classNames(S.container, className)}>
      <label className={S.selectContainer}>
        <InlineRow>
          <span className={S.label}>{t('Campaign')}</span>
          <Select 
            className={S.select}
            onChange={item => updateCampaign(item?.value || null)} 
            options={options}
            placeholder={t('Campaign')}
            getOptionLabel={({ value }) => labels[value]}
          />
        </InlineRow>
      </label>
      {showCheckbox && (
        <Checkbox checked={includeCoreSet} onChange={toggleCoreSet}>
          {t('Core Set')}
        </Checkbox>
      )}
    </div>
  );
}