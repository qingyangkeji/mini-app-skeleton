import { request } from './request';
export default {
    /**
     * 登录
     * @param {Object} params
     * @param {Object} reqConfig
     */
    login(params, reqConfig = {}) {
        return request('POST', `/self_logistics/login`, params, reqConfig);
    },
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRW5DLGVBQWU7SUFDYjs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQXdCLEVBQUUsU0FBUyxHQUFHLEVBQUU7UUFDNUMsT0FBTyxPQUFPLENBQXFCLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDeEYsQ0FBQztDQUNGLENBQUEiLCJmaWxlIjoiYXBpL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICog55m75b2VXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXFDb25maWcgXG4gICAqL1xuICBsb2dpbihwYXJhbXM6IEFwaS5sb2dpbi5wYXJhbXMsIHJlcUNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHJlcXVlc3Q8QXBpLmxvZ2luLnJlc3BvbnNlPignUE9TVCcsIGAvc2VsZl9sb2dpc3RpY3MvbG9naW5gLCBwYXJhbXMsIHJlcUNvbmZpZylcbiAgfSxcbn0iXX0=
