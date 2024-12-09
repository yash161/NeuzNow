import React, {useEffect, useState} from 'react';
import { StyleSheet, FlatList, ScrollView, ActivityIndicator} from 'react-native';

import TopNewsCard from '../components/TopNewsCard';
import newAPI from '../apis/News';

const TrendNews = ({ navigation }) => {

    const [isLoading, setLoading] = useState(true);
    const [newstech, setNewsTech] = useState([])

    useEffect(()=> {
        getNewsFromAPI()
    }, [])

    /* const newsResponse = async() => {
        const response = await newAPI.get('everything?q=tesla&from=2021-07-19&sortBy=publishedAt&apiKey=126f7f4b15e5441aa59dfe9edbf6a08a')
        console.log(response.data)
    } */

    function getNewsFromAPI() {
        newAPI.get('top-headlines?country=in&category=general&apiKey=126f7f4b15e5441aa59dfe9edbf6a08a')
        .then(async function(response){
            setNewsTech(response.data)
        })
        .catch(function(error){
            console.log(error);
        })
        .finally(function(){
            setLoading(false);
        })
    }

    if(!newstech) {
        return null
    }
    
    return (
        <ScrollView>
            {isLoading ? <ActivityIndicator visible={true} /> : (
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={newstech.articles}
                keyExtractor={(item, index) => 'key' + index}
                renderItem={({item}) => (
                    <TopNewsCard 
                        item={item}
                    />
                )}
            />
            )}
        </ScrollView>
    )
}

export default TrendNews