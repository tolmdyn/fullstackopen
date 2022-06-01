stuff = [{
  "brand": "Ford",
  "model": "Mustang",
},{
  "brand": "Renault",
  "model": "Master",
},{
  "brand": "Ford",
  "model": "Transit",
},{
  "brand": "Ford",
  "model": "Cortina",
},{
  "brand": "Renault",
  "model": "Trafic",
},{
  "brand": "Mini",
  "model": "Cooper",
}]

totals = {}

for car in stuff:
    if totals.get(car["brand"]):
        totals[car["brand"]]+=1
    else:
        totals[car["brand"]] = 1

max(totals, key=totals.get)
