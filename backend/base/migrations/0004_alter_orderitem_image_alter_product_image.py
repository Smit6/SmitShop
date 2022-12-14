# Generated by Django 4.1 on 2022-08-11 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_orderitem_image_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='image',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/placeholder.png', null=True, upload_to=''),
        ),
    ]
