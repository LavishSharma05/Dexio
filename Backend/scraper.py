import requests
from bs4 import BeautifulSoup

def extract_data(url:str,selector:list[str]):

    response=requests.get(url,timeout=10)
    response.raise_for_status()
        
    
    soup=BeautifulSoup(response.text,'html.parser')
    
    result={}
    for s in selector:
        selected_elements=soup.select(s)
        
        combined_data=[]
        
        for el in selected_elements:
            combined_data.append({
                "parsed":el.get_text(strip=True),
                "raw":el.decode()
            })
            
        
        result[s]=combined_data
        
        
    return result


    


    


