import pandas as pd
from django.core.management.base import BaseCommand
from toilet.models import Toilet

class Command(BaseCommand):
    help = 'Import toilet data from an Excel file'

    def handle(self, *args, **kwargs):
        file_path = 'toilet_data.xlsx'  # manage.py와 동일한 경로에 위치
        excel_data = pd.read_excel(file_path)

        for index, row in excel_data.iterrows():
            # Get latitude and longitude values, set to None if missing
            latitude = row['WGS84위도'] if pd.notnull(row['WGS84위도']) else None
            longitude = row['WGS84경도'] if pd.notnull(row['WGS84경도']) else None
            
            # Check if latitude and longitude are valid
            if latitude is None or longitude is None:
                self.stdout.write(self.style.WARNING(f'Skipping row {index + 1} due to missing latitude or longitude'))
                continue  # Skip this iteration if latitude or longitude is missing
            
            toilet = Toilet(
                name=row['화장실명'],
                address=row['소재지도로명주소'],
                male_stalls=row['남성용-대변기수'],
                female_stalls=row['여성용-대변기수'],
                is_accessible=(row['남성용-장애인용대변기수'] > 0 or row['여성용-장애인용대변기수'] > 0),
                opening_hours=row['개방시간'],
                latitude=latitude,
                longitude=longitude,
                managing_agency_name=row['관리기관명'],
                managing_agency_phone=row['전화번호'],
                waste_management_method=row['오물처리방식'],
                diaper_change_table_location=row['기저귀교환대장소'],  # 수정된 부분
            )
            # Save the instance to the database
            toilet.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {toilet.name}'))
