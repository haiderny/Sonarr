import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import episodeEntities from 'Episode/episodeEntities';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import QueueRowConnector from './QueueRowConnector';

const headers = [
  {
    name: 'status',
    label: ''
  },
  {
    name: 'series.sortTitle',
    label: 'Series',
    sortable: true
  },
  {
    name: 'episode',
    label: 'Episode'
  },
  {
    name: 'episodeTitle',
    label: 'Episode Title'
  },
  {
    name: 'quality',
    label: 'Quality',
    sortable: true
  },
  {
    name: 'protocol',
    label: 'Protocol'
  },
  {
    name: 'estimatedCompletionTime',
    label: 'Timeleft',
    sortable: true
  },
  {
    name: 'progress',
    label: 'Progress',
    sortable: true
  },
  {
    name: 'actions',
    label: ''
  }
];

class Queue extends Component {

  //
  // Render

  render() {
    const {
      fetching,
      populated,
      error,
      items,
      totalRecords,
      onRefreshPress,
      ...otherProps
    } = this.props;

    return (
      <PageContent title="Queue">
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              title="Refresh"
              isSpinning={fetching}
              onPress={onRefreshPress}
            />
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            fetching && !populated &&
              <LoadingIndicator />
          }

          {
            !fetching && error &&
              <div>
                Failed to load Queue
              </div>
          }

          {
            populated && !error && !items.length &&
              <div>
                Queue is empty
              </div>
          }

          {
            populated && !error && !!items.length &&
              <div>
                <Table
                  headers={headers}
                  {...otherProps}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <QueueRowConnector
                            key={item.id}
                            episodeId={item.episode.id}
                            episodeEntity={episodeEntities.QUEUE_EPISODES}
                            {...item}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>

                <TablePager
                  totalRecords={totalRecords}
                  fetching={fetching}
                  {...otherProps}
                />
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

Queue.propTypes = {
  fetching: PropTypes.bool.isRequired,
  populated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.array.isRequired,
  totalRecords: PropTypes.number,
  onRefreshPress: PropTypes.func.isRequired
};

export default Queue;
