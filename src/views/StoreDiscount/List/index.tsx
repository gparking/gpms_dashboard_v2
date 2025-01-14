import React from 'react';
import { ICorpTicketClassObj, ICorpTicketSearchReq } from '@models/corpTicketClass';
import { inject, observer } from 'mobx-react';
import { userStore } from '@store/userStore';
import { deleteCorpTicket } from '@api/storeDiscount';
import { runInAction } from 'mobx';
import moment from 'moment';
import { localeStore } from '@store/localeStore';
import { ColumnProps } from 'antd/lib/table';
import { EDelYn } from '@/constants/list';
import { conversionDate, conversionEnumValue } from '@utils/conversion';
import { DeleteOutlined } from '@ant-design/icons';
import PageWrapper from '@components/PageWrapper';
import StandardTable from '@components/StandardTable';
import { TablePaginationConfig } from 'antd/es/table';
import SearchForm from '@/components/StandardTable/SearchForm';
import { SearchCorpTicketFields } from '@views/StoreDiscount/List/fields/fields';
import zdsTips from '@utils/tips';
import { ISelectOptions } from '@utils/form';
import { getCorpAllTickets, getCorpApplyTickets } from '@api/corp';

interface IState {
  detailModal: boolean;
  createModal: boolean;
  loading: boolean;
  list: ICorpTicketClassObj[];
  current: number;
  pageSize: number;
  total: number;
  selected?: ICorpTicketClassObj;
  corpSn?: number;
  startDate?: Date;
  endDate?: Date;
  discountClassSn?: number;
  vehicleNo?: string;
  applyStatus?: string;
  searchParam?: ICorpTicketSearchReq;
  corpTicketClassOpt: ISelectOptions[];
}
@inject('localeStore', 'userStore')
@observer
class StoreDiscountList extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      createModal: false,
      detailModal: false,
      list: [],
      total: 0,
      current: 1,
      pageSize: 20,
      startDate: new Date(),
      endDate: new Date(),
      corpTicketClassOpt: []
    };
  }

  componentDidMount() {
    const { userInfo } = userStore;
    const createTm = [moment(new Date()).subtract(3, 'day'), moment(new Date())];
    const searchParam = {
      corpSn: Number(userInfo.corpSn),
      startDate: createTm[0].format('YYYY-MM-DD'),
      endDate: createTm[1].format('YYYY-MM-DD'),
      applyStatus: this.state.applyStatus ? this.state.applyStatus : null,
      vehicleNo: this.state.vehicleNo ? this.state.vehicleNo : null
    };
    // @ts-ignore
    this.setState({ searchParam: searchParam }, () => this.pollData());
    getCorpAllTickets(userInfo.corpSn, 'ALL')
      .then((res: any) => {
        const { msg, data } = res;
        if (msg === 'success') {
          const unique: ISelectOptions[] = [];
          runInAction(() => {
            data.forEach((e: any) => {
              unique.push({
                value: String(e.classSn),
                label: e.corpTicketClass.name
              });
            });
            unique.push({ value: '', label: '전체' });
            this.setState({ corpTicketClassOpt: unique });
          });
        }
      })
      .catch(() => {});
  }

  paginationChange = (pagination: TablePaginationConfig) => {
    this.setState({ current: pagination.current || 1 });
  };

  async pollData() {
    const { userInfo } = userStore;
    this.setState({ loading: true });
    getCorpApplyTickets(userInfo.corpSn, this.state.searchParam)
      .then((res: any) => {
        const { msg, data } = res;
        if (msg === 'success') {
          runInAction(() => {
            this.setState({ list: data });
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  handleBtnClick = (item: ICorpTicketClassObj, key: string) => {
    const { localeObj } = localeStore;
    if (key === 'delete') {
      zdsTips.confirm(localeObj['alert.delete'] || '선택 항목을 삭제(비활성) 하시겠습니까?', () => {
        deleteCorpTicket(item.sn)
          .then((res: any) => {
            const { msg, data } = res;
            if (msg === 'success') {
              runInAction(() => {
                this.pollData();
              });
            }
          })
          .catch(() => {});
      });
    }
  };

  getSearchData = (item: ICorpTicketSearchReq) => {
    const { userInfo } = userStore;
    const searchParma: ICorpTicketSearchReq = {
      corpSn: userInfo.corpSn,
      startDate: conversionDate(item.createTm!![0]),
      endDate: conversionDate(item.createTm!![1]),
      vehicleNo: item.vehicleNo,
      applyStatus: this.state.applyStatus,
      ticketClassSn: item.ticketClassSn
    };
    this.setState({ searchParam: searchParma }, () => {
      this.pollData();
    });
  };

  render() {
    const calcOpt: ISelectOptions[] = [
      { value: EDelYn.Y, label: '적용', color: 'blue' },
      { value: EDelYn.N, label: '미적용', color: 'red' }
    ];

    const columns: ColumnProps<ICorpTicketClassObj>[] = [
      {
        title: '적용',
        key: 'calcYn',
        width: 80,
        filters: calcOpt.map((r) => ({ text: r.label, value: r.value!! })),
        onFilter: (value, record) => record.calcYn?.indexOf(value as string) === 0,
        align: 'center',
        render: (test: string, record) => {
          const type = conversionEnumValue(record.calcYn ? record.calcYn : '-', calcOpt);
          return {
            props: {
              style: {
                color: record.delYn === EDelYn.Y ? 'gray' : type.color
              }
            },
            children: <div>{record.delYn === EDelYn.Y ? '취소' : type.label}</div>
          };
        }
      },
      {
        title: '차량번호',
        key: 'vehicleNo',
        width: 110,
        align: 'center',
        render: (test: string, record) => record.vehicleNo
      },
      {
        title: '할인권명',
        key: 'discountNm',
        width: 110,
        align: 'center',
        render: (test: string, record) => {
          const type = conversionEnumValue(
            record.ticketClassSn ? String(record.ticketClassSn)!! : record.discountNm!!,
            this.state.corpTicketClassOpt
          );
          return {
            children: <div>{type.label}</div>
          };
        }
      },
      {
        title: '수량',
        key: 'quantity',
        width: 60,
        align: 'center',
        render: (test: string, record) => record.quantity
      },
      {
        title: '적용일',
        key: 'createDate',
        width: 110,
        align: 'center',
        render: (test: string, record) => {
          return record.createDate
            ? conversionDate(record.createDate, '{y}-{m}-{d}') || '--'
            : null;
        }
      },
      {
        title: 'Action',
        width: 110,
        align: 'center',
        render: (item: ICorpTicketClassObj) =>
          item.calcYn === EDelYn.N && item.delYn === EDelYn.N ? (
            <div>
              <a
                onClick={(e: any) => {
                  e.stopPropagation();
                  this.handleBtnClick(item, 'delete');
                }}
              >
                <DeleteOutlined />
              </a>
            </div>
          ) : null
      }
    ];
    const { list, total, current, pageSize } = this.state;
    const searchFields = SearchCorpTicketFields(this.state.corpTicketClassOpt);
    return (
      <PageWrapper>
        <SearchForm
          submit={(value) => this.getSearchData(value)}
          location={this.props.location}
          fieldConfig={searchFields}
        />
        <StandardTable
          scroll={{ x: 'max-content' }}
          columns={columns}
          loading={this.state.loading}
          // @ts-ignore
          rowKey={(record: ICorpTicketClassObj) => String(record.sn)}
          data={{
            list,
            pagination: {
              total,
              current,
              pageSize,
              showSizeChanger: true,
              onShowSizeChange: (currentNum: any, size: any) => {
                this.setState({ pageSize: size });
                this.setState({ current: currentNum });
              }
            }
          }}
          onChange={this.paginationChange}
        />
      </PageWrapper>
    );
  }
}

export default StoreDiscountList;
