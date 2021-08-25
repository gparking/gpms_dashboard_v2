import { ECorpSearchCondition, EDayRangeType, EDelYn } from '@/constants/list';
import { IDiscountClassObj } from '@models/discountClass';

export interface ICorpObj {
  sn?: number;
  corpId?: string;
  corpName: string;
  createdBy?: string;
  delYn: EDelYn;
  dong: string;
  form?: number;
  ho: string;
  resident?: number;
  tel?: string;
  updateBy?: string;
  updateDate?: Date;
  ceoName?: string;
  userRole?: string;
  userName?: string;
  password: string;
  userPhone?: string;
}

export interface ICorpSearchReq {
  searchLabel?: ECorpSearchCondition;
  searchText?: string;
  useStatus?: EDelYn;
}

export interface ICorpTicketObj {
  sn?: number;
  corpSn: number;
  discountClassSn: number;
  totalQuantity: number;
  useQuantity?: number;
  orderNum?: number;
  delYn: EDelYn;
  discountClass: IDiscountClassObj;
  corp: ICorpObj;
  totalCnt: number;
  ableCnt: number;
  todayUse: number;
  // non entity
  applyCnt?: number;
}

export interface ICorpSearchVehicleObj {
  sn: number;
  vehicleNo: string;
  inDate: Date;
  imImagePath?: string;
  selected?: boolean | false;
}
