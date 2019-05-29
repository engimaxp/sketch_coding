import React, { Component } from 'react';
import WeatherData from '../../types/Weather';

interface WeatherProps {
    weatherProp: WeatherData;
  isFetching: boolean;
  startFetch: () => void;
}

export default class Weather extends Component<WeatherProps> {

    componentDidMount(): void {
        if ( !this.props.isFetching && !this.props.weatherProp ) {
            this.props.startFetch();
        }
    }

    render() {
        const nullableData =
            (data: WeatherData, component: () => (JSX.Element | Array<JSX.Element | undefined>)):
                () => JSX.Element | Array<JSX.Element | undefined> => {
                return (data ? component : () => <div>no Data</div>);
            };
        const weatherData: WeatherData | null = this.props.weatherProp;
        const item: (JSX.Element | Array<JSX.Element | undefined>) =
            nullableData(weatherData, () => [
                <div key={1}>city: {weatherData.city}</div>,
                <div key={2}>date: {weatherData.date}</div>,
                <div key={3}>humidity: {weatherData.humidity}</div>,
                <div key={4}>temperature: {weatherData.temperature}</div>,
                <div key={5}>weather: {weatherData.weather}</div>,
                <div key={6}>week: {weatherData.week}</div>])();
        return (
            <div>
                {item}
            </div>
    );
  }
}
