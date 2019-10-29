import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'react-tippy'
import Button from 'part:@sanity/components/buttons/default'
import LanguageFilter from 'part:@sanity/desk-tool/language-select-component?'
import SyncIcon from 'part:@sanity/base/sync-icon'
import CheckIcon from 'part:@sanity/base/check-icon'
import EyeIcon from 'part:@sanity/base/eye-icon'
import ValidationList from 'part:@sanity/components/validation/list'
import resolveContextualPreviews from 'part:@sanity/base/resolve-contextual-previews?'
import ChevronDown from 'part:@sanity/base/chevron-down-icon'
import WarningIcon from 'part:@sanity/base/warning-icon'
import SplitIcon from 'part:@sanity/base/bars-icon'
import {PaneRouterContext} from '../../index'
import styles from '../styles/Editor.css'

export default class Actions extends React.PureComponent {
  static contextType = PaneRouterContext

  static propTypes = {
    isLiveEditEnabled: PropTypes.bool.isRequired,
    isReconnecting: PropTypes.bool.isRequired,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.array
      })
    ).isRequired,
    onCloseValidationResults: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onToggleValidationResults: PropTypes.func.isRequired,
    showSavingStatus: PropTypes.bool.isRequired,
    showValidationTooltip: PropTypes.bool.isRequired,
    type: PropTypes.object.isRequired,
    value: PropTypes.object
  }
  // eslint-disable-next-line class-methods-use-this
  renderSavingStatus() {
    return (
      <Tooltip
        className={styles.syncStatusSyncing}
        arrow
        theme="light"
        size="small"
        distance="0"
        title="Syncing your content with the Sanity cloud"
      >
        <span className={styles.syncSpinnerContainer}>
          <span className={styles.syncSpinner}>
            <SyncIcon />
          </span>
          &nbsp;Syncing…
        </span>
      </Tooltip>
    )
  }

  // eslint-disable-next-line class-methods-use-this
  renderReconnecting() {
    return (
      <Tooltip
        className={styles.syncStatusReconnecting}
        arrow
        theme="light"
        size="small"
        distance="0"
        title="Connection lost. Reconnecting…"
      >
        <span className={styles.syncSpinnerContainer}>
          <span className={styles.syncSpinner}>
            <SyncIcon />
          </span>
          &nbsp;Reconnecting…
        </span>
      </Tooltip>
    )
  }

  // eslint-disable-next-line class-methods-use-this
  renderSyncedStatus() {
    const {isLiveEditEnabled} = this.props
    return (
      <Tooltip
        className={styles.syncStatusSynced}
        arrow
        theme="light"
        size="small"
        distance="0"
        title="Synced with the Sanity cloud"
      >
        <CheckIcon /> Synced {isLiveEditEnabled && ' (live)'}
      </Tooltip>
    )
  }

  renderSplitPaneButton() {
    return (
      <button type="button" onClick={this.handleSplitPane} title="Split pane">
        <div tabIndex={-1}>
          <SplitIcon />
        </div>
      </button>
    )
  }

  renderShowContextualPreviewsPane() {
    if (!resolveContextualPreviews) {
      return null
    }
    const currentDoc = this.props.value
    const options = {stuff: 'other stuff', myId: currentDoc._id}
    return (
      <button
        type="button"
        onClick={this.handleShowContextualPreview(options)}
        title="Contextual Previews pane"
      >
        <div tabIndex={-1}>
          <EyeIcon />
        </div>
      </button>
    )
  }

  renderViewButton() {
    return (
      <button type="button" onClick={this.handleToggleViewButton} title="Toggle view">
        <div tabIndex={-1}>
          <WarningIcon />
        </div>
      </button>
    )
  }

  handleShowContextualPreview = params => {
    return () => this.context.replaceChildPane('preview', params)
  }

  handleSplitPane = () => {
    this.context.duplicateCurrentPane()
  }

  handleToggleViewButton = () => {
    this.context.setPaneView('someView')
  }

  renderErrors() {
    const {
      onCloseValidationResults,
      onFocus,
      onToggleValidationResults,
      markers,
      showValidationTooltip,
      type
    } = this.props
    const validation = markers.filter(marker => marker.type === 'validation')
    const errors = validation.filter(marker => marker.level === 'error')
    const warnings = validation.filter(marker => marker.level === 'warning')
    if (errors.length === 0 && warnings.length === 0) {
      return null
    }
    return (
      <Tooltip
        arrow
        theme="light noPadding"
        trigger="click"
        position="bottom"
        interactive
        duration={100}
        open={showValidationTooltip}
        onRequestClose={onCloseValidationResults}
        html={
          <ValidationList
            truncate
            markers={validation}
            showLink
            isOpen={showValidationTooltip}
            documentType={type}
            onClose={onCloseValidationResults}
            onFocus={onFocus}
          />
        }
      >
        <Button
          color="danger"
          bleed
          icon={WarningIcon}
          padding="small"
          onClick={onToggleValidationResults}
        >
          {errors.length}
          <span style={{paddingLeft: '0.5em', display: 'flex'}}>
            <ChevronDown />
          </span>
        </Button>
      </Tooltip>
    )
  }

  render() {
    const {isReconnecting, showSavingStatus, value} = this.props

    return (
      <div className={styles.paneFunctions}>
        {LanguageFilter && <LanguageFilter />}
        {showSavingStatus && this.renderSavingStatus()}
        {isReconnecting && this.renderReconnecting()}
        {value && !showSavingStatus && !isReconnecting && this.renderSyncedStatus()}
        {this.renderErrors()}
        {this.renderSplitPaneButton()}
        {this.renderViewButton()}
        {this.renderShowContextualPreviewsPane()}
      </div>
    )
  }
}
