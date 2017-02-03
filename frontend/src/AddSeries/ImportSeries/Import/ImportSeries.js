import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import ImportSeriesTableConnector from './ImportSeriesTableConnector';
import ImportSeriesFooterConnector from './ImportSeriesFooterConnector';

class ImportSeries extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {},
      contentBody: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedState !== this.state.selectedState) {
      // this._table.forceUpdateGrid();
    }
  }

  //
  // Control

  setContentBodyRef = (ref) => {
    this.setState({ contentBody: ref });
  }

  //
  // Listeners

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState, { parseIds: false });
  }

  onSelectAllChange = ({ value }) => {
    // Only select non-dupes
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, this.props.unmappedFolders, id, value, shiftKey);
    });
  }

  onInputChange = ({ name, value }) => {
    this.props.onInputChange(this.getSelectedIds(), name, value);
  }

  onImportPress = () => {
    this.props.onImportPress(this.getSelectedIds());
  }

  //
  // Render

  render() {
    const {
      rootFolderId,
      path,
      rootFoldersFetching,
      rootFoldersPopulated,
      rootFoldersError,
      unmappedFolders
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState,
      contentBody
    } = this.state;

    return (
      <PageContent title="Import Series">
        <PageContentBody ref={this.setContentBodyRef}>
          {
            rootFoldersFetching && !rootFoldersPopulated &&
              <LoadingIndicator />
          }

          {
            !rootFoldersFetching && !!rootFoldersError &&
              <div>Unable to load root folders</div>
          }

          {
            !rootFoldersError && rootFoldersPopulated && !unmappedFolders.length &&
              <div>
                All series in {path} have been imported
              </div>
          }

          {
            !rootFoldersError && rootFoldersPopulated && !!unmappedFolders.length && contentBody &&
              <ImportSeriesTableConnector
                rootFolderId={rootFolderId}
                unmappedFolders={unmappedFolders}
                allSelected={allSelected}
                allUnselected={allUnselected}
                selectedState={selectedState}
                contentBody={contentBody}
                onSelectAllChange={this.onSelectAllChange}
                onSelectedChange={this.onSelectedChange}
              />
          }
        </PageContentBody>

        {
          !rootFoldersError && rootFoldersPopulated && !!unmappedFolders.length &&
            <ImportSeriesFooterConnector
              selectedCount={this.getSelectedIds().length}
              onInputChange={this.onInputChange}
              onImportPress={this.onImportPress}
            />
        }
      </PageContent>
    );
  }
}

ImportSeries.propTypes = {
  rootFolderId: PropTypes.number.isRequired,
  path: PropTypes.string,
  rootFoldersFetching: PropTypes.bool.isRequired,
  rootFoldersPopulated: PropTypes.bool.isRequired,
  rootFoldersError: PropTypes.object,
  unmappedFolders: PropTypes.arrayOf(PropTypes.object),
  onInputChange: PropTypes.func.isRequired,
  onImportPress: PropTypes.func.isRequired
};

ImportSeries.defaultProps = {
  unmappedFolders: []
};

export default ImportSeries;
