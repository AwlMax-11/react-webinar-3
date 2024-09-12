/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = [];
    this.lastCode = Math.max(0, ...this.state.list.map(item => item.code)); 
    this.state.list = this.state.list.map(item => ({
      ...item,
      selectCount: 0,
    }));
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    this.lastCode += 1; 
    this.setState({
      ...this.state,
      list: [
        ...this.state.list,
        { 
          code: this.lastCode, 
          title: 'Новая запись', 
          selected: false,    
          selectCount: 0      
        }
      ],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        if (item.code === code) {
          const isSelected = !item.selected;
          return {
            ...item,
            selected: isSelected,
            selectCount: isSelected ? item.selectCount + 1 : item.selectCount, 
          };
        }
        return {
          ...item,
          selected: false, 
        };
      }),
    });
  }
}

export default Store;
