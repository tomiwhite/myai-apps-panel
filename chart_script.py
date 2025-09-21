import plotly.graph_objects as go
import json

# Data for hosting options comparison
data = {"hosting_options": [{"name": "GitHub Pages", "ease_of_use": 7, "cost": 10, "customization": 9, "technical_features": 8}, {"name": "Google Sites", "ease_of_use": 10, "cost": 10, "customization": 4, "technical_features": 5}, {"name": "Netlify", "ease_of_use": 8, "cost": 9, "customization": 9, "technical_features": 9}, {"name": "Własny hosting", "ease_of_use": 4, "cost": 5, "customization": 10, "technical_features": 10}]}

# Categories for radar chart (abbreviated to meet 15 char limit)
categories = ['Ease of Use', 'Cost Value', 'Customization', 'Tech Features']

# Brand colors
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F']

fig = go.Figure()

# Add traces for each hosting option
for i, option in enumerate(data['hosting_options']):
    # Invert cost values so lower cost (better) shows as higher on radar
    cost_inverted = 11 - option['cost']
    values = [option['ease_of_use'], cost_inverted, option['customization'], option['technical_features']]
    
    fig.add_trace(go.Scatterpolar(
        r=values,
        theta=categories,
        fill='toself',
        name=option['name'],
        line_color=colors[i],
        fillcolor=colors[i],
        opacity=0.6,  # Reduce opacity for better visibility
        line=dict(width=3)  # Make border lines more distinct
    ))

fig.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 10],
            tickmode='linear',
            tick0=0,
            dtick=2
        )),
    title="HTML Hosting Comparison",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image("chart.png")
fig.write_image("chart.svg", format="svg")

fig.show()